import { Links } from './links.model';
import { Localization } from './localization.model';
import { MarketData } from './market-data.model';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: unknown;
  platforms: Record<string, string>;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  public_notice: unknown;
  additional_notices: string[];
  localization: Localization;
  description: Localization;
  links: Links;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  market_data: MarketData | null;
  community_data: {
    facebook_likes: string | number | null;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: string | number | null;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: { additions: number; deletions: number };
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: number[];
  };
  public_interest_stats: { alexa_rank: number; bing_matches: null | number };
  status_updates: number[];
  last_updated: Date;
}
