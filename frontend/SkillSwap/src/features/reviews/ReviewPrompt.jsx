import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { createReviewAsync } from './reviewsSlice.js';

const schema = yup.object({
  rating: yup
    .number()
    .typeError('Enter a number between 1 and 5')
    .min(1)
    .max(5)
    .required('Rating is required'),
  text: yup.string().max(500, 'Keep it under 500 characters')
});

const ReviewPrompt = ({ booking, partner }) => {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rating: 5, text: '' }
  });

  if (!partner?._id) return null;

  const onSubmit = (values) => {
    dispatch(
      createReviewAsync({
        rating: values.rating,
        text: values.text,
        booking: booking._id,
        toUser: partner._id
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Review submitted');
        setSubmitted(true);
        reset({ rating: 5, text: '' });
      })
      .catch(() => toast.error('Unable to submit review'));
  };

  if (submitted) {
    return <p className="text-sm text-emerald-600">Thanks! Your review was sent.</p>;
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Rating (1-5)"
        type="number"
        min={1}
        max={5}
        {...register('rating', { valueAsNumber: true })}
        error={errors.rating?.message}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Feedback for {partner.name}</span>
        <textarea
          className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          rows={3}
          placeholder="Share what went well"
          {...register('text')}
        />
        {errors.text && <span className="text-xs text-red-500">{errors.text.message}</span>}
      </label>
      <Button type="submit">Submit review</Button>
    </form>
  );
};

export default ReviewPrompt;

