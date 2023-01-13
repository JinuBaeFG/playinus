import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";

const TOKEN = "token"
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
    await AsyncStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
    tokenVar(token);
}

export const logUserOut = async () => {
    await AsyncStorage.removeItem(TOKEN);
    isLoggedInVar(false);
    tokenVar("");
    cache.evict((obj) => `User:${obj.username}`);
}

export const darkModeVar = makeVar(Boolean(AsyncStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
    AsyncStorage.setItem(DARK_MODE, "enable");
    darkModeVar(true);
}

export const disableDarkMode = () => {
    AsyncStorage.removeItem(DARK_MODE);
    darkModeVar(false);
}

const uploadHttpLink = createUploadLink({
    uri: "https://twenty-ants-relax-14-36-162-26.loca.lt/graphql",
});

const wsLink = new WebSocketLink({
    uri: "https://twenty-ants-relax-14-36-162-26.loca.lt/graphql",
    options: {
        connectionParams: () => ({
            token : tokenVar()        
        }),
    },
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: tokenVar()
        }
    }
});

const onErrorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        console.log(`Graphql Error`, graphQLErrors);
    }
    if (networkError) {
        console.log(`NetWork Error`, networkError);
    }
});


export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                seeFeed: offsetLimitPagination()
            }
        },
        User: {
            keyFields: (obj) => `User:${obj.username}`,
        },
        Message: {
            fileds: {
                user: {
                    merge : true,
                },
            },
        },
    },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLinks,
)

const client = new ApolloClient({
    link: splitLink,
    cache
})

export default client