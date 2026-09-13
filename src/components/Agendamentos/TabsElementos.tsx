import { Box, Tab, Tabs } from "@mui/material";
import 'dayjs/locale/pt-br';
import { useState } from "react";
import TabDetalhes from "./Tabs/TabDetalhes";
import Mapa from "../Mapa";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const ORANGE = "#F47B2A";

export default function TabsElementos() {
    const [tab, setTab] = useState(0);

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`equipment-tabpanel-${index}`}
                aria-labelledby={`equipment-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
            </div>
        );
    }

    return (
        <>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                    "& .MuiTabs-indicator": { backgroundColor: ORANGE, height: 3 },
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#8a93a0",
                    },
                    "& .Mui-selected": { color: `${ORANGE} !important` },
                }}
            >
                <Tab label="Detalhes" />
                <Tab label="Agendados" />
                <Tab label="Mapa / Rota" />
            </Tabs>

            <TabPanel value={tab} index={0}>
                <TabDetalhes />
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <TabDetalhes />
            </TabPanel>

            <TabPanel value={tab} index={2}>
                <Box sx={{
                    border: `5px solid ${ORANGE}`,
                    borderRadius: 2,
                    minWidth: 220,
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Mapa />
                </Box>
            </TabPanel>
        </>
    )
}