import "@/styles/contact-radio.css";

const Contact = () => (
  <main className="flex items-center justify-center h-full p-4">
    <div className="radio-container">
      <input id="contact-email" name="contact" type="radio" defaultChecked />
      <label htmlFor="contact-email">
        info@murban-eng.com
        <span className="block text-xs">Email Address</span>
      </label>

      <input id="contact-phone" name="contact" type="radio" />
      <label htmlFor="contact-phone">
        + 254 20 265 0618
        <span className="block text-xs">Phone Number</span>
      </label>

      <input id="contact-address" name="contact" type="radio" />
      <label htmlFor="contact-address">
        Off Airport Road, Mombasa Port Reitz
        <span className="block text-xs">Address</span>
      </label>

      <div className="glider-container">
        <div className="glider"></div>
      </div>
    </div>
  </main>
);

export default Contact;
