import React from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import { Card, CardContent } from './ui/card';

const AdminMenu = () => {
  return (
    <AuthenticatedLayout mainClassName="p-4 sm:p-8">
      <Card className="mx-auto max-w-3xl shadow-md">
        <CardContent className="p-6 sm:p-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Administrator Tools
          </h2>
          <p className="mb-8 text-muted-foreground">
            Manage submitted complaints, set resolutions, and update statuses.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Link
              to="/admin/complaints"
              className="block cursor-pointer rounded-lg border border-border bg-muted/40 p-6 shadow-sm transition-colors duration-200 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Manage Complaints
              </h3>
              <p className="text-sm text-muted-foreground">
                View the admin list and update complaint statuses and resolutions.
              </p>
            </Link>

            <Link
              to="/overall-view"
              className="block cursor-pointer rounded-lg border border-border bg-muted/40 p-6 shadow-sm transition-colors duration-200 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                View Public Statuses
              </h3>
              <p className="text-sm text-muted-foreground">
                Check the general, anonymous view of all submissions.
              </p>
            </Link>

            <Link
              to="/topics"
              className="block cursor-pointer rounded-lg border border-primary/20 bg-primary/5 p-6 shadow-sm transition-colors duration-200 hover:bg-primary/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:col-span-2"
            >
              <h3 className="mb-2 text-xl font-semibold text-primary">
                File New Complaint
              </h3>
              <p className="text-sm text-muted-foreground">
                Submit a new complaint or suggestion to the system.
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
};

export default AdminMenu;
