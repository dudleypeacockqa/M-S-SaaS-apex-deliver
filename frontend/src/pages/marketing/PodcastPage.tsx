import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { trackCtaClick } from '../../lib/analytics';

export const PodcastPage: React.FC = () => {
  const playlistId = import.meta.env.VITE_PODCAST_PLAYLIST_ID
  const playlistUrl = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    : null

  return (
    <MarketingLayout>
      <SEO
        title="Podcast: 100 Days and Beyond | ApexDeliver + CapLiquify"
        description="Join us for 100 Days and Beyond, where we explore M&A strategies, financial planning, and business transformation with industry experts and successful dealmakers."
        keywords="M&A podcast, business transformation podcast, finance podcast, 100 days and beyond"
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            100 Days and Beyond
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Your guide to M&A success, financial intelligence, and business transformation. Join industry experts as they share insights, strategies, and real-world experiences.
          </p>
        </div>
      </section>

      {/* YouTube Playlist Embed */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            {playlistUrl ? (
              <iframe
                title="100 Days and Beyond Podcast Playlist"
                className="w-full h-full"
                src={playlistUrl}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎙️</div>
                  <h3 className="text-2xl font-bold mb-2">YouTube Playlist Coming Soon</h3>
                  <p className="text-gray-300">Subscribe to stay updated on new episodes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About the Podcast */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            About the Podcast
          </h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p className="leading-relaxed">
              <strong>100 Days and Beyond</strong> is your essential resource for navigating the complex world of mergers and acquisitions, financial planning, and business transformation. Each episode brings you actionable insights from seasoned M&A professionals, fractional CFOs, and business leaders who have successfully executed hundreds of deals.
            </p>
            <p className="leading-relaxed">
              Whether you're preparing for your first acquisition, optimizing cash flow in a newly merged entity, or scaling a portfolio of businesses, our podcast delivers the strategies and frameworks you need to succeed.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Actionable Insights</h3>
              <p className="text-gray-600">
                Real strategies you can implement immediately in your deals and operations.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Guests</h3>
              <p className="text-gray-600">
                Learn from successful dealmakers, CFOs, and M&A advisors with proven track records.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth Focused</h3>
              <p className="text-gray-600">
                From deal sourcing to post-merger integration, we cover the entire M&A lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your M&A Operations?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Put the insights from our podcast into action with ApexDeliver + CapLiquify—the platform that powers successful M&A and financial transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('start-trial', 'podcast-page')}
            >
              Start Your Free 14-Day Trial
            </Link>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-100 text-indigo-900 border-2 border-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('schedule-demo', 'podcast-page')}
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
