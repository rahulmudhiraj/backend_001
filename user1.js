

//2-2

//workshop
const stripe=require('stripe')('pk_test_51OysROSD6eLhSv0z9kxummvO544AilWR9GzP2WqU2aFWSSbqBVsSmRzpRZx2g6rvcP0o5xX4LJGxR42K3KsupIpx00gnE6j2Gb')


allroutes.post('/create-payment-intent',upload.none(),async (req,res)=>{
  console.log(req.body);
  const { mamount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
      amount:mamount,
      currency: 'usd',
  });
  //res.json({ clientSecret: paymentIntent.client_secret });
  res.status(200).send({ clientSecret: paymentIntent.client_secret });
});