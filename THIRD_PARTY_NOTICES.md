# Visual references and data

- Wave Background: local adaptation of the design by Kain Xu / xubohuah, [21st.dev reference](https://21st.dev/@xubohuah/components/wave-background). The registry source requires authentication; this portfolio uses an independently implemented canvas effect.
- Wireframe Dotted Globe: adapted from the React/D3 reference supplied by the user, by shadway / moazamtrade, [21st.dev reference](https://21st.dev/@moazamtrade/components/wireframe-dotted-globe). Uses D3's orthographic projection with the existing portfolio palette, responsive canvas sizing, and locally bundled map geometry.
- Globe land geometry and points: derived from the public-domain [Natural Earth 1:110m land dataset](https://github.com/martynafford/natural-earth-geojson/blob/master/110m/physical/ne_110m_land.json). `lib/globe-land-source.json` records the source hash and point density. Dots are prepared ahead of time with `scripts/prepare-globe-land.mjs`; there are no runtime map requests.
- D3: [ISC license](https://github.com/d3/d3/blob/main/LICENSE); installed as an NPM dependency with its bundled license retained.
- Flickering Grid: adapted from [Magic UI](https://magicui.design/docs/components/flickering-grid), with the upstream MIT license retained in `licenses/Magic-UI-MIT.txt`.
- Spline: original portfolio scenes retain Spline's visible attribution. The source URLs and exact reference repairs are recorded in `public/scenes/source-manifest.json`.
