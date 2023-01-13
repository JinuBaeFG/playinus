import { gql, useMutation } from "@apollo/client";
import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useColorScheme } from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

export default function CreateAccount({ navigation }: any) {
  const onCompleted = (data: any) => {
    const {
      createAccount: { ok, error },
    } = data;
    const { username, password } = getValues();

    if (ok) {
      navigation.navigate("Login", { username, password });
    }

    if (error) {
      alert(error);
    }
  };
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const lastNameRef: React.MutableRefObject<null> = useRef(null);
  const userNameRef: React.MutableRefObject<null> = useRef(null);
  const emailRef: React.MutableRefObject<null> = useRef(null);
  const passwordRef: React.MutableRefObject<null> = useRef(null);

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  const onValid = (data: any) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  const isDark = useColorScheme() === "dark";

  return (
    <AuthLayout>
      <TextInput
        placeholder="First Name"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(lastNameRef)}
        onChangeText={(text: string) => setValue("firstName", text)}
      />
      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(userNameRef)}
        onChangeText={(text: string) => setValue("lastName", text)}
      />
      <TextInput
        ref={userNameRef}
        placeholder="User Name"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(emailRef)}
        onChangeText={(text: string) => setValue("username", text)}
      />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        keyboardType="email-address"
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("email", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        secureTextEntry
        returnKeyType="join"
        lastOne={true}
        isDark={isDark}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <AuthButton
        onPress={handleSubmit(onValid)}
        text={"Create Account"}
        loading={loading}
        disabled={
          !watch("firstName") ||
          !watch("lastName") ||
          !watch("username") ||
          !watch("email") ||
          !watch("password")
        }
      />
    </AuthLayout>
  );
}
