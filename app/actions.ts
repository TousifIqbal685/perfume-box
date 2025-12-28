"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(orderData: any) {
  const { id, customer_name, phone, address, total_amount, items } = orderData;

  try {
    const { data, error } = await resend.emails.send({
      // 1. Send FROM your verified domain
      from: "Perfume Box Orders <contact@perfumeboxbangladesh.com>",
      
      // 2. Send TO your business email (which forwards to your Gmail)
      to: [process.env.ADMIN_EMAIL as string],
      
      subject: `🔔 New Order! ${total_amount} BDT - ${customer_name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #f525bd;">🚀 New Order Received</h2>
          <p><strong>Order ID:</strong> ${id}</p>
          <p><strong>Customer:</strong> ${customer_name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          
          <h3>🛒 Order Items:</h3>
          <ul style="padding-left: 20px;">
            ${items
              .map(
                (item: any) =>
                  `<li style="margin-bottom: 5px;">
                    <strong>${item.title || item.name}</strong> x ${item.quantity} 
                    - ${item.price} BDT
                   </li>`
              )
              .join("")}
          </ul>
          
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;" />
          
          <h3 style="color: #111827;">Total Amount: ${total_amount} BDT</h3>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Server Action Error:", err);
    return { success: false, error: err.message };
  }
}