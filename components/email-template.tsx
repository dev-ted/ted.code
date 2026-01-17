import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function EmailTemplate({ name, email, phone, message }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1a1a1a' }}>
        New Contact Form Submission
      </h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ margin: '10px 0', fontSize: '16px', color: '#333' }}>
          <strong style={{ color: '#1a1a1a' }}>Name:</strong> {name}
        </p>
        <p style={{ margin: '10px 0', fontSize: '16px', color: '#333' }}>
          <strong style={{ color: '#1a1a1a' }}>Email:</strong> {email}
        </p>
        {phone && (
          <p style={{ margin: '10px 0', fontSize: '16px', color: '#333' }}>
            <strong style={{ color: '#1a1a1a' }}>Phone:</strong> {phone}
          </p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#1a1a1a' }}>
          Message:
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
