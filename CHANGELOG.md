# Cartonik ChangeLog

## v0.8.0 (2020-04-05)

- Normalize `renderer.getTile()`, now returns an object with buffer property, it renames `tile` by `buffer`
- Add `renderer.getStats()` to get information about the renderer's performance
- Add new metric: remaining renderers to be acquired by the internal pool
- Bumps `acorn` from `6.2.0` to `6.4.1`

## v0.7.0 (2019-07-30)

- Preview: add option `concurrency` to avoid map-pool exhaustion in renderer

## v0.6.1 (2019-07-10)

- Upgrade @carto/mapnik to version 3.6.2-carto.16

## v0.6.0 (2019-06-17)

- Implements `preview` method to to create static maps from tiles based on center (lng, lat) coordinates or bounding box area
- Calculate zoom based on bounding box parameter as default value
- Now bouding box is an object ({ west, south, east, north })
- Now center uses a lng, lat nomeclature

## v0.5.1 (2019-05-21)

- Upgrade @carto/mapnik to version 3.6.2-carto.15

## v0.5.0 (2019-04-29)

- Upgrade @carto/mapnik to version 3.6.2-carto.13

## v0.4.0 (2019-04-26)

- First public release

## v0.3.0 (2019-03-18) (*deprecated*)

- Publish module under @carto scope
- Stop using babel, use Node.js modules
- Implement metatiling
- Do not support path as argument

## v0.2.1 (2017-07-15) (*deprecated*)

- Fix bad condition

## v0.2.0 (2017-07-15) (*deprecated*)

- Accept 'png' encoding

## v0.1.0 (2017-07-14) (*deprecated*)

- Hello world!
