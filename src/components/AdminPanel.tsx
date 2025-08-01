import React, { useState, useEffect } from 'react';
import { Star, Check, X, Eye, Trash2, Calendar, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const updateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      });

      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive"
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });

      fetchReviews();
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const bulkDeleteReviews = async (reviewIds: string[]) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .in('id', reviewIds);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${reviewIds.length} review(s) deleted successfully`,
      });

      fetchReviews();
      setSelectedReviews([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reviews",
        variant: "destructive"
      });
    }
  };

  const deleteAllReviews = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "All reviews deleted successfully",
      });

      fetchReviews();
      setSelectedReviews([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all reviews",
        variant: "destructive"
      });
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const selectAllReviews = () => {
    setSelectedReviews(reviews.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedReviews([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingReviews = reviews.filter(r => !r.is_approved);
  const approvedReviews = reviews.filter(r => r.is_approved);

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-display">{review.customer_name}</CardTitle>
            <p className="text-sm text-muted-foreground font-military">
              {review.customer_email}
            </p>
            <p className="text-xs text-muted-foreground font-military flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(review.created_at)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-current" />
              ))}
            </div>
            <Badge variant={review.is_approved ? "default" : "secondary"}>
              {review.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-military mb-4">{review.review_text}</p>
        <div className="flex space-x-2">
          {!review.is_approved && (
            <Button
              size="sm"
              onClick={() => updateReviewStatus(review.id, true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}
          {review.is_approved && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateReviewStatus(review.id, false)}
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteReview(review.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Admin Panel - Review Management</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="pending" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedReviews.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-military">No pending reviews</p>
              </div>
            ) : (
              pendingReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : approvedReviews.length === 0 ? (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-military">No approved reviews</p>
              </div>
            ) : (
              approvedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Bulk Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="w-5 h-5 mr-2" />
                    Bulk Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllReviews}
                          disabled={selectedReviews.length === reviews.length}
                        >
                          Select All ({reviews.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                          disabled={selectedReviews.length === 0}
                        >
                          Clear Selection
                        </Button>
                        {selectedReviews.length > 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete Selected ({selectedReviews.length})
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Selected Reviews</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {selectedReviews.length} selected review(s)? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => bulkDeleteReviews(selectedReviews)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>

                      {/* Review Selection List */}
                      <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                        <h4 className="font-semibold mb-3">Select Reviews to Delete:</h4>
                        <div className="space-y-2">
                          {reviews.map((review) => (
                            <div key={review.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedReviews.includes(review.id)}
                                onCheckedChange={() => toggleReviewSelection(review.id)}
                              />
                              <div className="flex-1 text-sm">
                                <span className="font-medium">{review.customer_name}</span>
                                <span className="text-muted-foreground ml-2">
                                  {review.customer_email}
                                </span>
                                <Badge 
                                  variant={review.is_approved ? "default" : "secondary"}
                                  className="ml-2"
                                >
                                  {review.is_approved ? "Approved" : "Pending"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-destructive">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Delete All Reviews</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        This will permanently delete all reviews from the database. This action cannot be undone.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            disabled={reviews.length === 0}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete All Reviews ({reviews.length})
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete All Reviews</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete ALL {reviews.length} reviews? This action is permanent and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={deleteAllReviews}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;