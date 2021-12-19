import React, {FunctionComponent} from 'react';
import {Col, Container, Row} from "reactstrap";
import {Sider} from "./sider/Sider";
import {Editor} from "./paper/Paper";

export const App: FunctionComponent = () =>
    <Container fluid className="p-0 m-0 h-100">
        <Row className="g-0 h-100">
            <Col xs={12} md={4} className="h-100">
                <Sider/>
            </Col>
            <Col xs={12} md={8} className="h-100">
                <Editor/>
            </Col>
        </Row>
    </Container>
