#!/usr/bin/env python3
"""Fill the Kit placeholders with sample content so the template can be
previewed in a browser. Run after editing the template:  python3 email/make-preview.py"""
import pathlib

HERE = pathlib.Path(__file__).parent
SAMPLE = """
      <h2>Three shows this month, and the shirts are finally here</h2>

      <p>Hey! Quick update from the four of us. We've got a busy stretch coming
      up on the island, and a couple of things worth flagging.</p>

      <h3>Where we're playing</h3>
      <ul>
        <li><strong>Fri, July 11</strong> &mdash; Lazy Bass, North Wildwood (5&ndash;9 PM)</li>
        <li><strong>Sat, July 19</strong> &mdash; Gully's, Avalon (4&ndash;8 PM)</li>
        <li><strong>Sun, July 27</strong> &mdash; Lost Buoy (5&ndash;9 PM)</li>
      </ul>

      <p>The Lazy Bass one always fills up early, so get there before five if
      you want a table anywhere near the stage.</p>

      <h3>Merch</h3>
      <p>The drumstick tees came in and they look great. We'll have them at
      every show this summer &mdash; cash or card, $25. Sizes S through XXL.</p>

      <blockquote>"You are so entertaining and very talented artists. Rock on!!"</blockquote>

      <p>Thanks as always for coming out. It genuinely makes the difference.</p>

      <p>&mdash; Finn, and the rest of Three and One</p>
"""

html = (HERE / 'three-and-one-template.html').read_text()
for placeholder, value in {
    '{{ message_content }}': SAMPLE,
    '{{ unsubscribe_url }}': '#unsubscribe',
    '{{ subscriber_preferences_url }}': '#preferences',
    '{{ address }}': 'Three and One Band &middot; 123 Ocean Ave &middot; Avalon, NJ 08202',
    'https://YOURDOMAIN/#shows': 'http://localhost:8000/#shows',
}.items():
    html = html.replace(placeholder, value)

out = HERE / 'preview.html'
out.write_text(html)
print(f'wrote {out}')
