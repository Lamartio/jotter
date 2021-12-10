import React, {FunctionComponent} from 'react';
import './App.css';
import {Col, Container, Row} from "reactstrap";
import {Paper} from "./Paper";
import {Sider} from "./Sider";

export const App: FunctionComponent = () =>
    <Container fluid>
        <Row>
            <Col xs={12} md={4} lg={2}>
                <Sider/>
            </Col>
            <Col xs={12} md={8}>
                <Paper title="New idea"/>
            </Col>
            <Col xs={0} lg={2}/>
        </Row>
    </Container>
