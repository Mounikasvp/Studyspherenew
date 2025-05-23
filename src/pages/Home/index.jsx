import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { Col, Grid, Row } from "rsuite";
import Sidebar from "../../components/Sidebar";
import { RoomsProvider } from "../../context/rooms.context";
import { useMediaQuery } from "../../misc/custom-hooks";
import Chat from "./Chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const { isExact } = useRouteMatch();

  const canRenderSidebar = isDesktop || isExact;

  return (
    <RoomsProvider>
      <div className="chat-page">
        <Grid fluid className={`h-100 ${isTablet ? 'full-width-grid' : ''}`}>
          <Row className={`h-100 ${isTablet ? 'full-width-row' : ''}`}>
            {canRenderSidebar && (
              <Col xs={24} md={isTablet ? 24 : 8} className={`h-100 ${isTablet ? 'full-width-col' : ''}`}>
                <div className="sidebar">
                  <Sidebar />
                </div>
              </Col>
            )}

            <Switch>
              <Route exact path="/chat/:chatId">
                <Col xs={24} md={isTablet ? 24 : 16} className={`h-100 ${isTablet ? 'full-width-col' : ''}`}>
                  <div className="chat-area">
                    <Chat />
                  </div>
                </Col>
              </Route>
              <Route>
                {isDesktop && (
                  <Col xs={24} md={isTablet ? 24 : 16} className={`h-100 ${isTablet ? 'full-width-col' : ''}`}>
                    <div className="empty-chat-placeholder">
                      <FontAwesomeIcon icon={faComments} className="placeholder-icon" />
                      <h3>Select a Chat Room</h3>
                      <p>Choose a chat room from the sidebar or create a new one to start messaging</p>
                    </div>
                  </Col>
                )}
              </Route>
            </Switch>
          </Row>
        </Grid>
      </div>
    </RoomsProvider>
  );
};

export default Home;
