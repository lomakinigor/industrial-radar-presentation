from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PresentationContractTests(unittest.TestCase):
    def test_five_slide_story_and_real_links(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(len(re.findall(r'class="slide(?: |")', html)), 5)
        self.assertIn("Промышленный радар", html)
        self.assertIn("Supabase", html)
        self.assertIn("Perplexity", html)
        self.assertIn("https://blast-insight-bot.lovable.app", html)
        self.assertIn("Открыть приложение", html)
        self.assertNotIn("Lorem ipsum", html)

    def test_local_assets_exist(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for asset in re.findall(r'(?:href|src)="(?!https?://|#)([^"]+)"', html):
            self.assertTrue((ROOT / asset).is_file(), asset)


if __name__ == "__main__":
    unittest.main()
