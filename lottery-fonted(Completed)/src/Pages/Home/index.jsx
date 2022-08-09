import React from "react";
import { 
    Heading, 
    VStack, 
    Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import Play from "./Play";
import Claim from "./Claim";

const Home = () => {
    return (
        <Tabs isLazy={true} align='center' h='100%' colorScheme='purple'>
            <TabList>
                <Tab fontWeight='bold'>Play</Tab>
                <Tab fontWeight='bold'>Claim</Tab>
            </TabList>

            <TabPanels h='100%'>
                <TabPanel h='100%' p={0}>
                    <Play />
                </TabPanel>
                <TabPanel h='100%' p={0}> 
                    <Claim />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Home;