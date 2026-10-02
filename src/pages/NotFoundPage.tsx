import React from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <EmptyState
        icon={Compass}
        title="Page Not Located"
        description="The navigation coordinates you requested do not correspond to an active Nexora collection or account route."
        actionLabel="Return Home"
        onAction={onNavigateHome}
        secondaryLabel="Explore Catalog"
        onSecondaryAction={onNavigateShop}
      />
    </div>
  );
};
