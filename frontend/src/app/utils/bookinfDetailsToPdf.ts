import jsPDF from 'jspdf'; // Import jsPDF

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
}

interface bookingDetailsToPdfProps{
    startDate: string | null;
    endDate: string | null;
    model: string | null;
    paymentData: RazorpayResponse | undefined;
    amount: number | undefined;
}
export const bookingDetailsToPdf = ({model,amount, startDate, endDate, paymentData }:bookingDetailsToPdfProps)=>{
    const doc = new jsPDF();
    
    // Add company name and header with color
    doc.setTextColor(159, 0, 0); // Blue color
    doc.setFontSize(22);
    doc.text("Booking Success", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text("PREMIUM LIMO", doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Add some space
    doc.setTextColor(0, 0, 0); // Default text color
    doc.setFontSize(12);

    // Draw a border around the details and fill color
    doc.setLineWidth(0.5);
    doc.setDrawColor(159, 0, 0); // Blue border color
    doc.setFillColor(230, 230, 250); // Light purple fill
    doc.rect(10, 55, 190, 60, 'FD'); // F for fill, D for draw
    doc.text("Booking Details", doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

    // Add booking details
    doc.setFontSize(10);
    doc.text(`Model: ${model}`, 15, 60);
    doc.text(`Amount: $${amount}`, 15, 70);
    doc.text(`Start Date: ${startDate}`, 15, 80);
    doc.text(`End Date: ${endDate}`, 15, 90);
    doc.text(`Order ID: ${paymentData?.razorpay_order_id}`, 15, 100);
    doc.text(`Payment ID: ${paymentData?.razorpay_payment_id}`, 15, 110);

    // Draw another border for company contact information and fill color
    doc.setLineWidth(0.5);
    doc.setDrawColor(159, 0, 0); // Blue border color
    doc.setFillColor(230, 230, 250); // Light purple fill
    doc.rect(10, 120, 190, 60, 'FD'); // F for fill, D for draw

    // Footer section
    doc.setTextColor(159, 0, 0); // Blue color
    doc.setFontSize(12);
    doc.text("Thank you for your business!", doc.internal.pageSize.getWidth() / 2, 200, { align: 'center' });
    doc.text("If you have any questions, feel free to contact us.", doc.internal.pageSize.getWidth() / 2, 210, { align: 'center' });
    
    // Contact Information
    doc.text("Premium Limo", doc.internal.pageSize.getWidth() / 2, 130, { align: 'center' });
    doc.text("Address: 1234 Your Street, Your City, Your State, ZIP", doc.internal.pageSize.getWidth() / 2, 140, { align: 'center' });
    doc.text("Phone: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, 150, { align: 'center' });
    doc.text("Email: contact@yourcompany.com", doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });

    doc.save('booking-details.pdf');
}