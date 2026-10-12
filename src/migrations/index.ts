import * as migration_20261012_132641_initial from './20261012_132641_initial';
import * as migration_20261012_140000_seed_markdown_posts from './20261012_140000_seed_markdown_posts';

export const migrations = [
  {
    up: migration_20261012_132641_initial.up,
    down: migration_20261012_132641_initial.down,
    name: '20261012_132641_initial'
  },
  {
    up: migration_20261012_140000_seed_markdown_posts.up,
    down: migration_20261012_140000_seed_markdown_posts.down,
    name: '20261012_140000_seed_markdown_posts'
  },
];
