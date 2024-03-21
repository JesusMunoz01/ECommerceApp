import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      const cardElement = elements.getElement(CardElement);

      if (!cardElement){
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
    
      if (!error) {
        console.log(paymentMethod);
      }
    };
    

    return (
        <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit">Pay</button>
        </form>
    )
}

export default CheckoutForm;