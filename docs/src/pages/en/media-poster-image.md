---
title: <media-poster-image>
description: Media Poster Image
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-poster-image.js
---

Shows a poster image before the media has been played, optionally showing a placeholder image before the poster has loaded.

<h3>Default (no size/display by default because there is no image)</h3>

<style>
media-poster-image {
  display: block;
  line-height: 0;
  font-size: 0;
}
media-poster-image[src] {
  aspect-ratio: 16 / 9;
}
</style>

<media-poster-image></media-poster-image>

```html
<media-poster-image></media-poster-image>
```

<h3>With src</h3>

<media-poster-image
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"></media-poster-image>

```html
<media-poster-image
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
></media-poster-image>
```

<h3>With placeholder-src and src</h3>

<media-poster-image
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
  placeholder-src="data:image/jpeg;base64,/9j/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAcADIDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQABAgQGBwP/xAAtEAABBAECBAUEAgMAAAAAAAABAgMEEQUAIQYSMXETIkFRYQcjgZEUFRYy4f/EABcBAQEBAQAAAAAAAAAAAAAAAAQDBQD/xAArEQACAQIDBAsBAAAAAAAAAAABAgADEQQSMQUTkfAUISJBQlFhcaGx4fH/2gAMAwEAAhEDEQA/ABbGBzcOGqRNxL6KTzONFs2D13Hqe13oRNwLC0uSUyFofuywpsharF7X31oMdh3YrjoOXnSpKgQmQ62Qtnb/AGFrNdzv7au4HFQWkxMvNcfXElNEMusoDaC2gkFayokqWaPv10GnXa9h8fskmzF3RNRu16TluVkSocJtt2K4lBcUtpZ2JWmht2sXoR/fSXnluzCp0qVZsmtG0ZkSs8+hhK5r/iKbajODmHKSQAN7J6VyjvrX8X4TC4qHEfkCKh9LaFSoy6SkOCuZBIFK9jRG96Xi3CNkPX7TqGzxUW/3OcSZ8Z0K8JSkE+gG2malhSfM46VdLKTR/wC6sPMNRsuiPFX4CJCylt9y+QJJomgkmiPzo0/ORiHGHWop8BaPtTHwpKFOJVXlKxRqtx1G+hZSXCAawzYfLpPaPwjlnWG3QyulpCt6HUfJ0tQ/r4yt3ONMZzndX2nDv671vpad0en5SWUQNA4tlGVIjCaWo7gNtyLcJ+LHQ/PxrRP5rO5FiNFbkunEtAR48cfbShNUkUAf3vrc5r6ecJrxLTzWMTHKGXF00a5iOarJs+g9dZE4qFDREnxW1NOjFMyCkLPKpwrAJI/OsZcQgAKDW44fya1DEeA6k6x8RjOHcdnYklcBMRaUh+U6mYlxQ5DzKVSVbJ2GxF7aGZudgcpxE/KxqnFwaSlQW4Qh1V9CSdwAPjc6OZLh/G/5hiogQ6kT47a3XEuEKBULITWwHxWofUdjHcPyEsxcNjX+Qp5lvsWXLTvzUQP0Bq1PEqQARcmMeky3I7pWeLDmPUXGsehYtLchHmVZ9rI7UB31DE4Oc2+Jq3HnWikK8LwkOtvUTy7b11Pp+tCk42I1BjyWWy0t5XmCSaHa+mjWTyM3H8PRJQe/klThTyPpBSK9RQBv86qaTMLqeMNvEDAMITREHIL4QwyjW5Ug2e/zpasR8xJLDZLTG6R6H276Wi2bkmJzryBP/9k="></media-poster-image>

```html
<media-poster-image
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
  placeholder-src="data:image/jpeg;base64,/9j/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAcADIDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQABAgQGBwP/xAAtEAABBAECBAUEAgMAAAAAAAABAgMEEQUAIQYSMXETIkFRYQcjgZEUFRYy4f/EABcBAQEBAQAAAAAAAAAAAAAAAAQDBQD/xAArEQACAQIDBAsBAAAAAAAAAAABAgADEQQSMQUTkfAUISJBQlFhcaGx4fH/2gAMAwEAAhEDEQA/ABbGBzcOGqRNxL6KTzONFs2D13Hqe13oRNwLC0uSUyFofuywpsharF7X31oMdh3YrjoOXnSpKgQmQ62Qtnb/AGFrNdzv7au4HFQWkxMvNcfXElNEMusoDaC2gkFayokqWaPv10GnXa9h8fskmzF3RNRu16TluVkSocJtt2K4lBcUtpZ2JWmht2sXoR/fSXnluzCp0qVZsmtG0ZkSs8+hhK5r/iKbajODmHKSQAN7J6VyjvrX8X4TC4qHEfkCKh9LaFSoy6SkOCuZBIFK9jRG96Xi3CNkPX7TqGzxUW/3OcSZ8Z0K8JSkE+gG2malhSfM46VdLKTR/wC6sPMNRsuiPFX4CJCylt9y+QJJomgkmiPzo0/ORiHGHWop8BaPtTHwpKFOJVXlKxRqtx1G+hZSXCAawzYfLpPaPwjlnWG3QyulpCt6HUfJ0tQ/r4yt3ONMZzndX2nDv671vpad0en5SWUQNA4tlGVIjCaWo7gNtyLcJ+LHQ/PxrRP5rO5FiNFbkunEtAR48cfbShNUkUAf3vrc5r6ecJrxLTzWMTHKGXF00a5iOarJs+g9dZE4qFDREnxW1NOjFMyCkLPKpwrAJI/OsZcQgAKDW44fya1DEeA6k6x8RjOHcdnYklcBMRaUh+U6mYlxQ5DzKVSVbJ2GxF7aGZudgcpxE/KxqnFwaSlQW4Qh1V9CSdwAPjc6OZLh/G/5hiogQ6kT47a3XEuEKBULITWwHxWofUdjHcPyEsxcNjX+Qp5lvsWXLTvzUQP0Bq1PEqQARcmMeky3I7pWeLDmPUXGsehYtLchHmVZ9rI7UB31DE4Oc2+Jq3HnWikK8LwkOtvUTy7b11Pp+tCk42I1BjyWWy0t5XmCSaHa+mjWTyM3H8PRJQe/klThTyPpBSK9RQBv86qaTMLqeMNvEDAMITREHIL4QwyjW5Ug2e/zpasR8xJLDZLTG6R6H276Wi2bkmJzryBP/9k="
></media-poster-image>
```

<h3>Has played (media has started playback once) (hidden)</h3>

<media-poster-image
  media-has-played
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
  placeholder-src="data:image/jpeg;base64,/9j/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAcADIDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQABAgQGBwP/xAAtEAABBAECBAUEAgMAAAAAAAABAgMEEQUAIQYSMXETIkFRYQcjgZEUFRYy4f/EABcBAQEBAQAAAAAAAAAAAAAAAAQDBQD/xAArEQACAQIDBAsBAAAAAAAAAAABAgADEQQSMQUTkfAUISJBQlFhcaGx4fH/2gAMAwEAAhEDEQA/ABbGBzcOGqRNxL6KTzONFs2D13Hqe13oRNwLC0uSUyFofuywpsharF7X31oMdh3YrjoOXnSpKgQmQ62Qtnb/AGFrNdzv7au4HFQWkxMvNcfXElNEMusoDaC2gkFayokqWaPv10GnXa9h8fskmzF3RNRu16TluVkSocJtt2K4lBcUtpZ2JWmht2sXoR/fSXnluzCp0qVZsmtG0ZkSs8+hhK5r/iKbajODmHKSQAN7J6VyjvrX8X4TC4qHEfkCKh9LaFSoy6SkOCuZBIFK9jRG96Xi3CNkPX7TqGzxUW/3OcSZ8Z0K8JSkE+gG2malhSfM46VdLKTR/wC6sPMNRsuiPFX4CJCylt9y+QJJomgkmiPzo0/ORiHGHWop8BaPtTHwpKFOJVXlKxRqtx1G+hZSXCAawzYfLpPaPwjlnWG3QyulpCt6HUfJ0tQ/r4yt3ONMZzndX2nDv671vpad0en5SWUQNA4tlGVIjCaWo7gNtyLcJ+LHQ/PxrRP5rO5FiNFbkunEtAR48cfbShNUkUAf3vrc5r6ecJrxLTzWMTHKGXF00a5iOarJs+g9dZE4qFDREnxW1NOjFMyCkLPKpwrAJI/OsZcQgAKDW44fya1DEeA6k6x8RjOHcdnYklcBMRaUh+U6mYlxQ5DzKVSVbJ2GxF7aGZudgcpxE/KxqnFwaSlQW4Qh1V9CSdwAPjc6OZLh/G/5hiogQ6kT47a3XEuEKBULITWwHxWofUdjHcPyEsxcNjX+Qp5lvsWXLTvzUQP0Bq1PEqQARcmMeky3I7pWeLDmPUXGsehYtLchHmVZ9rI7UB31DE4Oc2+Jq3HnWikK8LwkOtvUTy7b11Pp+tCk42I1BjyWWy0t5XmCSaHa+mjWTyM3H8PRJQe/klThTyPpBSK9RQBv86qaTMLqeMNvEDAMITREHIL4QwyjW5Ug2e/zpasR8xJLDZLTG6R6H276Wi2bkmJzryBP/9k="></media-poster-image>

```html
<media-poster-image
  media-has-played
  src="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
  placeholder-src="data:image/jpeg;base64,/9j/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAcADIDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQABAgQGBwP/xAAtEAABBAECBAUEAgMAAAAAAAABAgMEEQUAIQYSMXETIkFRYQcjgZEUFRYy4f/EABcBAQEBAQAAAAAAAAAAAAAAAAQDBQD/xAArEQACAQIDBAsBAAAAAAAAAAABAgADEQQSMQUTkfAUISJBQlFhcaGx4fH/2gAMAwEAAhEDEQA/ABbGBzcOGqRNxL6KTzONFs2D13Hqe13oRNwLC0uSUyFofuywpsharF7X31oMdh3YrjoOXnSpKgQmQ62Qtnb/AGFrNdzv7au4HFQWkxMvNcfXElNEMusoDaC2gkFayokqWaPv10GnXa9h8fskmzF3RNRu16TluVkSocJtt2K4lBcUtpZ2JWmht2sXoR/fSXnluzCp0qVZsmtG0ZkSs8+hhK5r/iKbajODmHKSQAN7J6VyjvrX8X4TC4qHEfkCKh9LaFSoy6SkOCuZBIFK9jRG96Xi3CNkPX7TqGzxUW/3OcSZ8Z0K8JSkE+gG2malhSfM46VdLKTR/wC6sPMNRsuiPFX4CJCylt9y+QJJomgkmiPzo0/ORiHGHWop8BaPtTHwpKFOJVXlKxRqtx1G+hZSXCAawzYfLpPaPwjlnWG3QyulpCt6HUfJ0tQ/r4yt3ONMZzndX2nDv671vpad0en5SWUQNA4tlGVIjCaWo7gNtyLcJ+LHQ/PxrRP5rO5FiNFbkunEtAR48cfbShNUkUAf3vrc5r6ecJrxLTzWMTHKGXF00a5iOarJs+g9dZE4qFDREnxW1NOjFMyCkLPKpwrAJI/OsZcQgAKDW44fya1DEeA6k6x8RjOHcdnYklcBMRaUh+U6mYlxQ5DzKVSVbJ2GxF7aGZudgcpxE/KxqnFwaSlQW4Qh1V9CSdwAPjc6OZLh/G/5hiogQ6kT47a3XEuEKBULITWwHxWofUdjHcPyEsxcNjX+Qp5lvsWXLTvzUQP0Bq1PEqQARcmMeky3I7pWeLDmPUXGsehYtLchHmVZ9rI7UB31DE4Oc2+Jq3HnWikK8LwkOtvUTy7b11Pp+tCk42I1BjyWWy0t5XmCSaHa+mjWTyM3H8PRJQe/klThTyPpBSK9RQBv86qaTMLqeMNvEDAMITREHIL4QwyjW5Ug2e/zpasR8xJLDZLTG6R6H276Wi2bkmJzryBP/9k="
></media-poster-image>
```

## Attributes

| Name              | Type     | Default Value | Description                                                                                |
| ----------------- | -------- | ------------- | ------------------------------------------------------------------------------------------ |
| `src`             | `string` | none          | The src URL or or [data URI](https://css-tricks.com/data-uris/) for the image.             |
| `placeholder-src` | `string` | none          | The src URL or or [data URI](https://css-tricks.com/data-uris/) for the placeholder image. |

## Slots

_None_

## Styling

See our [styling docs](./styling)
