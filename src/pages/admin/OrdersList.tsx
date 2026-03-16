import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { fetchOrders, refundOrderPayment } from '@/lib/api/admin';
import type { AdminOrder } from '@/lib/api/admin';

function canRefundOrder(order: AdminOrder) {
  return order.status === 'completed'
    && !!order.stripe_payment_intent_id
    && !order.stripe_refund_id
    && !order.refunded_at;
}

export default function AdminOrdersList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchOrders,
  });

  const refundMutation = useMutation({
    mutationFn: refundOrderPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast({
        title: 'Order refunded',
        description: data.revokedEnrollmentCount > 0
          ? `Revoked ${data.revokedEnrollmentCount} enrollment${data.revokedEnrollmentCount === 1 ? '' : 's'}.`
          : 'Refund recorded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Refund failed',
        description: error instanceof Error ? error.message : 'Unable to refund this order.',
        variant: 'destructive',
      });
    },
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-muted text-foreground dark:bg-muted/40 dark:text-foreground',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Orders</h1>

      <Card>
        <CardContent className="p-4 md:p-0">
          <div className="space-y-4 md:hidden">
            {orders.map((order: AdminOrder) => {
              const isRefundingOrder = refundMutation.isPending && refundMutation.variables === order.id;

              return (
                <Card key={order.id}>
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="content-stack">
                        <p className="font-mono text-sm text-card-foreground">{order.id.slice(0, 8)}...</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={statusColors[order.status] ?? statusColors.pending}>
                        {order.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Courses</p>
                      <div className="mt-2 space-y-1">
                        {order.order_items?.map((item) => (
                          <p key={item.id} className="text-sm text-card-foreground">
                            {item.courses?.title ?? 'Unknown Course'}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Amount</p>
                        <p className="mt-1 font-medium text-card-foreground">{formatCurrency(Number(order.amount_total))}</p>
                      </div>
                      {order.refunded_at && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Refunded</p>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(order.refunded_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {canRefundOrder(order) ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full" disabled={refundMutation.isPending}>
                            {isRefundingOrder ? 'Refunding...' : 'Refund Order'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Refund this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will issue a full refund of {formatCurrency(Number(order.amount_total))}
                              {' '}through Stripe and immediately revoke access to every course in this order.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => refundMutation.mutate(order.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={refundMutation.isPending}
                            >
                              {isRefundingOrder ? 'Refunding...' : 'Refund Order'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {order.status === 'refunded' ? 'Refunded' : 'No actions available'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {orders.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">No orders yet.</p>
            )}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: AdminOrder) => {
                  const isRefundingOrder = refundMutation.isPending && refundMutation.variables === order.id;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.order_items?.map((item) => (
                            <p key={item.id} className="text-sm">
                              {item.courses?.title ?? 'Unknown Course'}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(Number(order.amount_total))}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status] ?? statusColors.pending}>
                          {order.status}
                        </Badge>
                        {order.refunded_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(order.refunded_at).toLocaleString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {canRefundOrder(order) ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={refundMutation.isPending}
                              >
                                Refund
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Refund this order?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will issue a full refund of {formatCurrency(Number(order.amount_total))}
                                  {' '}through Stripe and immediately revoke access to every course in this order.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => refundMutation.mutate(order.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={refundMutation.isPending}
                                >
                                  {isRefundingOrder ? 'Refunding...' : 'Refund Order'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : order.status === 'refunded' ? (
                          <span className="text-sm text-muted-foreground">Refunded</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
