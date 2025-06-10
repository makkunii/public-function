// src/pages/HomePage.jsx
import React from 'react';
import { Typography, Button, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <div className="p-4 md:p-6">
      <Title level={2}>Welcome to the Home Page</Title>
      <Paragraph>
        This is the main content area of the home page. You can use Ant Design's Grid system for responsive layouts.
      </Paragraph>
      <Row gutter={[16, 24]} className="mt-4">
        <Col xs={24} md={12} lg={8}>
          <Card title="Feature 1" variant={false}>
            <Paragraph>Content for feature 1.</Paragraph>
            <Button type="primary">Learn More</Button>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="Feature 2" variant={false}>
            <Paragraph>Content for feature 2.</Paragraph>
            <Button type="primary">Learn More</Button>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Feature 3" variant={false}>
            <Paragraph>Content for feature 3.</Paragraph>
            <Button type="primary">Learn More</Button>
          </Card>
        </Col>
      </Row>
      <div className="mt-8">
        <Title level={3}>More Information</Title>
        <Paragraph>More details and explanations.</Paragraph>
      </div>
    </div>
  );
}

export default HomePage;