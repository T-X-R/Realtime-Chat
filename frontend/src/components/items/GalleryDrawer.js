import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  Avatar,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import Profile from "./Profile";
import { useHistory } from "react-router-dom";
import { getSender } from "../../config/ChatConfig";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {

  const {
    user,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();

  // user logout
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // all user pictures and questions
  const galleryHandler = () => {
    history.push("/items");
  };

  // back to chat page
  const backHandler = () => {
    history.push("/chats");
    history.go();
  };

  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Button
          display="flex"
          size="md"
          colorScheme="teal"
          variant="outline"
          onClick={backHandler}
        >
          Back to Chat
        </Button>
        <Text fontSize="2xl" fontFamily="Work sans">
          Welcome to Gallery
        </Text>
        <div>
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter((fn) => fn !== n));
                  }}
                >
                  {n.chat.isGroupChat
                    ? `New Message in ${n.chat.chatName}`
                    : `New Message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuDivider />
              <MenuItem onClick={galleryHandler}>My Gallery</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </Flex>
  );
};

export default SideDrawer;
