import { gql, useQuery } from "@apollo/client";
import { EVENT_FRAGMENT_NATIVE } from "../fragments";

const SEE_EVENT_QUERY = gql`
  query seeSportsEvent($offset: Int!) {
    seeSportsEvent(offset: $offset) {
      ...EventFragmentNative
    }
  }
  ${EVENT_FRAGMENT_NATIVE}
`;

export default function useSportsEvent() {
  const { data: eventList } = useQuery(SEE_EVENT_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const tagData: any = [];
  if (eventList) {
    eventList.seeSportsEvent.map((event: any) => {
      tagData.push({
        id: event.id,
        eventname: event.eventname,
        isChecked: false,
      });
    });
  }

  return tagData;
}
