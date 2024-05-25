import Header from '@/app/(app)/Header'
import ReviewDetail from '@/components/ReviewDetail/ReviewDetail'
import React from 'react'

const page = ({
    params,
}: {
    params: { reviewId: string }
  }) => {

  const { reviewId } = params




    return (
        <div>
            <Header title="Review-Detail" />
        レビューの詳細ページ
        <ReviewDetail reviewId={reviewId} />

        </div>
    )
}

export default page

