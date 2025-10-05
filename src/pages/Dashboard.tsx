import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Newspaper, 
  MessageSquare, 
  Image,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';
import api from '../services/api';

interface DashboardStats {
  services: number;
  packages: number;
  products: number;
  news: number;
  contacts: number;
  media: number;
  unreadContacts: number;
  publishedNews: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    packages: 0,
    products: 0,
    news: 0,
    contacts: 0,
    media: 0,
    unreadContacts: 0,
    publishedNews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        services,
        packages,
        products,
        news,
        contacts,
        media,
        unreadContacts,
        publishedNews
      ] = await Promise.all([
        api.getServices(),
        api.getPackages(),
        api.getProducts(),
        api.getNews(),
        api.getContacts(),
        api.getMedia(),
        api.getContacts().then(contacts => contacts.filter(c => !c.isRead)),
        api.getNews().then(news => news.filter(n => n.isPublished))
      ]);

      setStats({
        services: services.length,
        packages: packages.length,
        products: products.length,
        news: news.length,
        contacts: contacts.length,
        media: media.length,
        unreadContacts: unreadContacts.length,
        publishedNews: publishedNews.length,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Services',
      value: stats.services,
      icon: Settings,
      color: 'bg-blue-500',
      href: '/services'
    },
    {
      name: 'Packages',
      value: stats.packages,
      icon: Package,
      color: 'bg-green-500',
      href: '/packages'
    },
    {
      name: 'Products',
      value: stats.products,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      href: '/products'
    },
    {
      name: 'News Articles',
      value: stats.news,
      icon: Newspaper,
      color: 'bg-orange-500',
      href: '/news'
    },
    {
      name: 'Contacts',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'bg-red-500',
      href: '/contacts'
    },
    {
      name: 'Media Files',
      value: stats.media,
      icon: Image,
      color: 'bg-indigo-500',
      href: '/media'
    },
  ];

  const quickStats = [
    {
      name: 'Unread Contacts',
      value: stats.unreadContacts,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Published News',
      value: stats.publishedNews,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Unitrux Admin Panel. Here's an overview of your content.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className={`${stat.bgColor} rounded-lg p-6`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={card.href}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/services/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium">Add Service</span>
              </a>
              <a
                href="/products/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ShoppingBag className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium">Add Product</span>
              </a>
              <a
                href="/news/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Newspaper className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">Add News</span>
              </a>
              <a
                href="/media/upload"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Image className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-sm font-medium">Upload Media</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

