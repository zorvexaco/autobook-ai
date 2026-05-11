export interface ReplyTemplate {
  template_key: string;
  label: string;
  template_text: string;
}

export const DEFAULT_REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    template_key: "booking_confirmation",
    label: "Booking Confirmation",
    template_text:
      "Hi {customer_name}, your appointment for {service_name} has been confirmed for {appointment_date} at {appointment_time}. We look forward to seeing you at {business_name}!",
  },
  {
    template_key: "booking_reminder",
    label: "Booking Reminder",
    template_text:
      "Hi {customer_name}, this is a reminder that your {service_name} appointment is coming up on {appointment_date} at {appointment_time}. Reply CONFIRM to keep your spot or let us know if you need to reschedule.",
  },
  {
    template_key: "cancellation_ack",
    label: "Cancellation Acknowledgement",
    template_text:
      "Hi {customer_name}, your {service_name} appointment on {appointment_date} has been cancelled. If you'd like to rebook, just reply with your preferred date and time.",
  },
  {
    template_key: "reschedule_offer",
    label: "Reschedule Offer",
    template_text:
      "Hi {customer_name}, we have an opening on {suggested_date} at {suggested_time} for {service_name}. Would you like to reschedule to this time? Reply YES to confirm.",
  },
  {
    template_key: "missed_call_followup",
    label: "Missed Call Follow-up",
    template_text:
      "Hi, we noticed we missed your call to {business_name}. How can we help you? If you'd like to book an appointment, reply with the service you're interested in and your preferred time.",
  },
  {
    template_key: "new_lead_welcome",
    label: "New Lead Welcome",
    template_text:
      "Welcome to {business_name}! We're glad you reached out. How can we assist you today? You can view our services at {website_url} or reply here to book an appointment.",
  },
  {
    template_key: "review_request",
    label: "Review Request",
    template_text:
      "Hi {customer_name}, thank you for visiting {business_name}! We hope you enjoyed your {service_name}. We'd love to hear your feedback — please leave us a review at {review_url}.",
  },
  {
    template_key: "waitlist_notification",
    label: "Waitlist Notification",
    template_text:
      "Great news, {customer_name}! A spot has opened up for {service_name} on {appointment_date} at {appointment_time}. Reply BOOK to claim it before it fills up.",
  },
  {
    template_key: "service_inquiry",
    label: "Service Inquiry",
    template_text:
      "Thanks for asking about our services, {customer_name}! We offer {service_list}. Would you like to schedule an appointment or learn more about a specific service?",
  },
  {
    template_key: "hours_inquiry",
    label: "Hours Inquiry",
    template_text:
      "Thanks for reaching out! {business_name} is open {business_hours}. Would you like to book an appointment during those hours?",
  },
  {
    template_key: "after_hours",
    label: "After Hours",
    template_text:
      "Thanks for contacting {business_name}. We're currently closed but will get back to you first thing during our next business hours: {business_hours}. If you'd like, reply with your preferred appointment time and we'll get you booked.",
  },
  {
    template_key: "thank_you",
    label: "Thank You",
    template_text:
      "Thank you for choosing {business_name}, {customer_name}! We appreciate your business and look forward to seeing you again soon.",
  },
];
