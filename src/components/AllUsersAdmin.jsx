import React, { useEffect } from 'react';
import { loadStripe } from "@stripe/stripe-js";

const AllUsersAdmin = () => {
  
  async function fetchSubscribedUser() {
    try {
      const stripe = await loadStripe('pk_test_51ORYlmSFkgnN12a3jUDD29GFe3SyBlHRBNuxCgKY46njWUO5AcPt9bO03KfI6AqnRPlEEgjacRiqCt07QnjE2veE00uDyYzs0D');

      if (!stripe) {
        throw new Error('Failed to load Stripe.');
      }

      const subscriptions = await stripe.subscriptions.list({
        status: 'active', // Make sure 'active' is a string here
      });

      console.log(subscriptions);
    } catch (error) {
      console.error('Error fetching subscribed users:', error);
    }
  }

  useEffect(() => {
    fetchSubscribedUser();
  }, []);

  return (
    <div>
      <header className="form-header">
        <span className="text-4xl font-bold text-primary-200 mt-3">
          All Users
        </span>
      </header>
      <div>
        {/* You can render subscription data here if needed */}
      </div>
    </div>
  );
}

export default AllUsersAdmin;
