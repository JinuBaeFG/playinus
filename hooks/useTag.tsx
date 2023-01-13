import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { TAG_FRAGMENT_NATIVE } from "../fragments";

const SEE_TAG_QUERY = gql`
  query seeTag($offset: Int!) {
    seeTag(offset: $offset) {
      ...TagFragmentNative
    }
  }
  ${TAG_FRAGMENT_NATIVE}
`;

export default function useTag() {
  const { data: tagList } = useQuery(SEE_TAG_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const tagData: any = [];
  if (tagList) {
    tagList.seeTag.map((tag: any) => {
      tagData.push({
        id: tag.id,
        tagname: tag.tagname,
        isUse: false,
        isCustom: false,
      });
    });
  }

  return tagData;
}
