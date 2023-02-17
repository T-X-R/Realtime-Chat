import { Box } from "@chakra-ui/react";
import React from "react";
import MyGallery from "../components/MyGallery";
import QuestionBox from "../components/QuestionBox";
import { ChatState } from "../context/ChatProvider";
import GalleryDrawer from "../components/items/GalleryDrawer";

const ItemPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <GalleryDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91vh"
        p="10px"
        mt={1}
      >
        {user && <MyGallery />}
        {user && <QuestionBox />}
      </Box>
    </div>
  );
};

export default ItemPage;
