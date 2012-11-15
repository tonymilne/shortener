---
-- Redis Shorten Lua Script.
-- Tony Milne (Inlight Media).

-- Example usage:
-- eval <script> 2 short-urls:sequence short-urls:set http://inlight.com.au
-- @keys[1] sequence A string type key used for generating the next integer in sequence.
-- @keys[2] hash A hash type key used to map the derived slug to the argv[1] data.
-- @argv[1] the data to be mapped against the derived slug (e.g. a url to "shorten").
---

local sequence = redis.call('incr', KEYS[1])
local slug = ''

-- Build a slug from the sequence number using Tantek's base60.
-- Refer to http://ttk.me/w/NewBase60 for more information.

local chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'
local remaining = sequence
while (remaining > 0) do
	local d = (remaining % 60)
	local character = string.sub(chars, d + 1, d + 1)

	slug = character .. slug
	remaining = (remaining - d) / 60
end

-- Set the slug -> data on the hash.
redis.call('hset', KEYS[2], slug, ARGV[1])

return slug