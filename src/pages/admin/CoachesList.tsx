import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from '@/lib/icons';
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
import { deleteCoach, fetchAllCoachesAdmin } from '@/lib/api/admin';
import type { AdminCoach } from '@/types/coach';

export default function AdminCoachesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ['admin', 'coaches'],
    queryFn: fetchAllCoachesAdmin,
  });

  const deleteCoachMutation = useMutation({
    mutationFn: deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaches'] });
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast({ title: 'Coach deleted' });
    },
    onError: () => {
      toast({ title: 'Failed to delete coach', variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Coaches</h1>
        <Link to="/admin/coaches/new">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Coach
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 md:p-0">
          <div className="space-y-4 md:hidden">
            {coaches.map((coach: AdminCoach) => (
              <Card key={coach.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start gap-3">
                    {coach.imageUrl ? (
                      <img
                        src={coach.imageUrl}
                        alt={coach.name}
                        className="h-16 w-16 flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 flex-shrink-0 bg-muted" />
                    )}
                    <div className="content-stack">
                      <h2 className="font-bold text-card-foreground">{coach.name}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">/{coach.slug}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{coach.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Courses</p>
                      <p className="mt-1 font-medium text-card-foreground">{coach.courseCount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {coach.published ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Eye className="mr-1 h-3 w-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="mr-1 h-3 w-3" />
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/admin/coaches/${coach.id}/edit`} className="block w-full">
                      <Button variant="outline" className="w-full">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Coach</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{coach.name}"? Existing courses will be unassigned from this coach. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCoachMutation.mutate(coach.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
            {coaches.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No coaches yet. Create the first coach profile.
              </p>
            )}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coaches.map((coach: AdminCoach) => (
                  <TableRow key={coach.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {coach.imageUrl ? (
                          <img
                            src={coach.imageUrl}
                            alt={coach.name}
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted" />
                        )}
                        <div>
                          <p className="font-medium">{coach.name}</p>
                          <p className="text-xs text-muted-foreground">/{coach.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{coach.title}</TableCell>
                    <TableCell>{coach.courseCount}</TableCell>
                    <TableCell>
                      {coach.published ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <Eye className="mr-1 h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/coaches/${coach.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Coach</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{coach.name}"? Existing courses will be unassigned from this coach. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCoachMutation.mutate(coach.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {coaches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No coaches yet. Create the first coach profile.
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
