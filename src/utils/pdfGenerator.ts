import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (booking: any) => {
  try {
    console.log("Generating invoice for:", booking);
    const doc = new jsPDF();
    const carName = booking.car?.name || 'Vehicle';
    const userName = booking.user?.name || 'Customer';

    // Header
    doc.setFontSize(20);
    doc.setTextColor(249, 115, 22); // Orange-500
    doc.text('DesiRent Car Rental', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Premium Vehicle Rental Service', 14, 28);
    doc.text('Invoice # ' + (booking.bookingId || booking.id), 150, 22);
    doc.text('Date: ' + new Date().toLocaleDateString(), 150, 28);

    // Line
    doc.setDrawColor(240, 240, 240);
    doc.line(14, 35, 196, 35);

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', 14, 45);
    doc.setFontSize(10);
    doc.text(userName, 14, 52);
    doc.text(booking.user?.email || '', 14, 58);
    doc.text(booking.user?.phone || '', 14, 64);

    // Booking Details
    doc.setFontSize(12);
    doc.text('Booking Details:', 120, 45);
    doc.setFontSize(10);
    doc.text('Vehicle: ' + carName, 120, 52);
    doc.text('Pickup: ' + (booking.pickupLocation || 'N/A'), 120, 58);
    doc.text('Drop: ' + (booking.dropLocation || 'N/A'), 120, 64);

    // Table
    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Duration', 'Rate', 'Total']],
      body: [
        [
          `Car Rental: ${carName}`,
          `${Math.ceil((new Date(booking.returnDate).getTime() - new Date(booking.pickupDate).getTime()) / (1000 * 60 * 60 * 24))} Days`,
          `₹${booking.car?.price || 0}/day`,
          `₹${booking.totalAmount}`
        ],
        [
          'Service Fee',
          '-',
          '-',
          '₹0'
        ]
      ],
      headStyles: { fillColor: [249, 115, 22] },
      theme: 'striped'
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text('Total Amount:', 130, finalY + 20);
    doc.text(`INR ${booking.totalAmount}`, 170, finalY + 20);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing DesiRent!', 14, finalY + 40);
    doc.text('For support: support@desirent.in | +91 1234567890', 14, finalY + 46);

    // Save
    doc.save(`Invoice_${booking.bookingId || booking.id}.pdf`);
    console.log("Invoice generated successfully");
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    alert("Failed to generate invoice. Please check console for details.");
  }
};
