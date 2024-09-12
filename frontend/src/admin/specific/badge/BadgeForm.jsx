import React, { useState } from 'react'
import { Form, Input, Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const BadgeForm = () => {
  const [badgeName, setBadgeName] = useState('');
  const [badgePrice, setBadgePrice] = useState('');
  const [badgeImage, setBadgeImage] = useState(null);

  const onNameChange = (e) => setBadgeName(e.target.value);
  const onPriceChange = (e) => setBadgePrice(e.target.value);
  
  // Handling file upload
  const onImageUpload = (info) => {
    if (info.file.status === 'done') {
      setBadgeImage(info.file.originFileObj);
    }
  };

  const onFinish = () => {
    // Logic for handling form submission
    const formData = {
      badgeName,
      badgePrice,
      badgeImage,
    };
    console.log('Form submitted:', formData);
    // You can add more logic for submitting the data to the backend here.
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {/* Badge Name */}
      <Form.Item
        label="Badge Name"
        name="badgeName"
        rules={[{ required: true, message: 'Please input the badge name!' }]}
      >
        <Input value={badgeName} onChange={onNameChange} placeholder="Enter badge name" />
      </Form.Item>

      {/* Badge Price */}
      <Form.Item
        label="Badge Price"
        name="badgePrice"
        rules={[{ required: true, message: 'Please input the badge price!' }]}
      >
        <Input value={badgePrice} onChange={onPriceChange} placeholder="Enter badge price" />
      </Form.Item>

      {/* Badge Image */}
      <Form.Item
        label="Badge Image"
        name="badgeImage"
        rules={[{ required: true, message: 'Please upload a badge image!' }]}
      >
        <Upload
          name="badgeImage"
          listType="picture"
          beforeUpload={() => false} // Prevents automatic upload
          onChange={onImageUpload}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Badge
        </Button>
      </Form.Item>
    </Form>
  );
}

export default BadgeForm;
