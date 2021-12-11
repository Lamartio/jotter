import React, {FunctionComponent} from 'react';
import {Col, Container, Row} from "reactstrap";
import {Sider} from "./sider/Sider";
import {Paper} from "./paper/Paper";

export const App: FunctionComponent = () =>
    <Container fluid className="p-0 m-0">
        <Row className="g-0">
            <Col xs={12} md={4} lg={2}>
                <Sider/>
            </Col>
            <Col xs={12} md={8}>
                <Paper/>
            </Col>
            <Col xs={0} lg={2}/>
        </Row>
    </Container>
