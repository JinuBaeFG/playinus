import { gql } from "@apollo/client"

export const PHOTO_FRAGMENT_NATIVE = gql`
    fragment PhotoFragmentNative on Photo {
        id
        files {
            id
            fileUrl
        }
        likes
        commentNumber
        isLiked
    }
`;

export const COMMENT_FRAGMENT_NATIVE = gql`
    fragment CommentFragmentNative on Comment {
        id
        user {
            id
            username
            avatar
        }
        payload
        isMine
        createdAt
    }
`;

export const USER_FRAGMENT_NATIVE = gql`
    fragment UserFragmentNative on User {
        id
        username
        avatar
        isFollowing
        isMe
    }
`
export const FEED_PHOTO_NATIVE = gql`
    fragment FeedPhoto on Photo {
     ...PhotoFragmentNative
      user {
        id
        username
        avatar
      }
      caption
      createdAt
      isMine
    }
    ${PHOTO_FRAGMENT_NATIVE}
`

export const ROOM_FRAGMENT_NATIVE = gql`
    fragment RoomParts on Room {
      id
      unreadTotal
      users {
        username
        avatar
      }
    }
`

export const TAG_FRAGMENT_NATIVE = gql`
    fragment TagFragmentNative on Tag {
        id
        tagname
        isUse
        isCustom
    }
`

export const EVENT_FRAGMENT_NATIVE = gql`
    fragment EventFragmentNative on SportsEvent {
        id
        eventname
    }
`

export const GROUPINFO_FRAGMENT_NATIVE = gql`
    fragment GroupInfoFragmentNative on GroupInfo {
        id
        awardDate
        discription
    }
`

export const GROUP_FRAGMENT_NATIVE = gql`
    fragment GroupFragmentNative on Group {
        id
        groupname
        activeArea
        areaLatitude
        areaLongitude
        sportsEvent
        photoUrl
        discription
        users {
            id
            username
            avatar
        }
        groupInfo {
            id
            discription
            awardDate
        }
        facility {
            id
            areaAddress
            discription
            facilityname
            facilityTag {
                tagname
            }
            facilityEvent {
                id
                sportsEvent
            }
        }
        groupTag {
            id
            tagname
            isUse
            isCustom
        }
        userCount
        maxMember
        createdAt
        isJoin
        isJoining
        groupJoin {
            id
            user {
                id
                username
                avatar
            }
        }
        isPresident
        groupPresident {
            id
            user {
                id
                username
                avatar
            }
        }
    }
`