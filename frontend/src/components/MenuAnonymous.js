import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import PublicNav from './layout/PublicNav';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const MenuAnonymous = () => {
  return (
    <AppLayout headerRight={<PublicNav page="home" />} homeTo="/" mainClassName="flex flex-col items-center justify-center p-6 sm:p-8">
      <Card className="w-full max-w-md text-center shadow-md">
        <CardContent className="p-8 sm:p-10">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Welcome
          </h2>
          <p className="mb-8 text-sm text-muted-foreground sm:text-base">
            File a new complaint or view the status of public submissions.
          </p>
          <Button asChild size="lg" className="w-full max-w-xs">
            <Link to="/overall-view">View all complaints</Link>
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default MenuAnonymous;
