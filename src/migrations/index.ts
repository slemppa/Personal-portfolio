import * as migration_20261012_132641_initial from './20261012_132641_initial';
import * as migration_20261012_140000_seed_markdown_posts from './20261012_140000_seed_markdown_posts';
import * as migration_20261012_135000_media_object_key from './20261012_135000_media_object_key';
import * as migration_20261012_150000_attach_seed_covers from './20261012_150000_attach_seed_covers';

export const migrations = [
  {
    up: migration_20261012_132641_initial.up,
    down: migration_20261012_132641_initial.down,
    name: '20261012_132641_initial',
  },
  {
    up: migration_20261012_135000_media_object_key.up,
    down: migration_20261012_135000_media_object_key.down,
    name: '20261012_135000_media_object_key',
  },
  {
    up: migration_20261012_140000_seed_markdown_posts.up,
    down: migration_20261012_140000_seed_markdown_posts.down,
    name: '20261012_140000_seed_markdown_posts',
  },
  {
    up: migration_20261012_150000_attach_seed_covers.up,
    down: migration_20261012_150000_attach_seed_covers.down,
    name: '20261012_150000_attach_seed_covers',
  },
];
