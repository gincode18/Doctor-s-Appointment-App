import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import EmailTemplate from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req){
    const response = await req.json();
    
    try{
        console.log("Email sending attempt");
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        
        // Make sure we have date instead of Date to match the EmailTemplate props
        if (response.Date && !response.date) {
            response.date = response.Date;
            delete response.Date;
        }
        
        const data = await resend.emails.send({
            from: 'Acmeonboarding@resend.dev',
            to: [response.Email],
            subject: 'Appointment Booking Confirmation',
            react: EmailTemplate(response)
          });
        return NextResponse.json({data})
    }
    catch(error)
    {
        console.log("Error in Email");
        console.log('====================================');
        console.log(error);
        console.log('Data received:', response);
        console.log('====================================');
        return NextResponse.json({error})
    }
}