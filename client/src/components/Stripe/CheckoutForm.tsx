import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {

      return;
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (result.error) {
      setPaymentError(result.error.message);
    } else {
      // Send the payment method ID to your server
      console.log(result.paymentMethod.id);
      // Here you would make a request to your server to process the payment
      // e.g., axios.post('/charge', { payment_method_id: result.paymentMethod.id })
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {paymentError && <div>{paymentError}</div>}
    </form>
  );
};

export default CheckoutForm;
