import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
 
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  
  export const EmailTemplate = ({
    UserName,
    Email,
    Time,
    date,
    doctor,
    Note
  }) => {
    // Format date string if it's a date object or ISO string
    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';
    
    return (
      <Html>
        <Head />
        <Preview>
          Your Appointment Confirmation with Doctor
        </Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src={`${baseUrl}/logo.svg`}
              width="170"
              height="50"
              alt="Doctor App"
              style={logo}
            />
            <Text style={paragraph}>Hi {UserName},</Text>
            <Text style={paragraph}>
             Your Appointment with Doctor has been booked on {formattedDate} at {Time}
            </Text>
            <Section>
              <Text style={detailsHeader}>Appointment Details:</Text>
              <Text style={detailsItem}>Date: {formattedDate}</Text>
              <Text style={detailsItem}>Time: {Time}</Text>
              {doctor && <Text style={detailsItem}>Doctor ID: {doctor}</Text>}
              {Note && <Text style={detailsItem}>Note: {Note}</Text>}
            </Section>
            <Text style={paragraph}>
              Best,
              <br />
              Doctor's Appointment App 
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              Developed by Kartik Gupta ❤️!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  

  
  export default EmailTemplate;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center",
  };
  
  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };

  const detailsHeader = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const detailsItem = {
    fontSize: "14px",
    lineHeight: "24px",
    margin: "4px 0",
  };
  