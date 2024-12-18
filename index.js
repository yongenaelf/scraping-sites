// Apify SDK v3 uses named exports instead of the Apify object.
// You can import Dataset, KeyValueStore and more.
import { Actor } from "apify";
// We moved all the crawling components to Crawlee.
// See the documentation on https://crawlee.dev
import { PlaywrightCrawler } from "crawlee";

const startUrls = ["https://docs.aelf.com"]; // change this to your start URL

// Initialize the actor on the platform. This function connects your
// actor to platform events, storages and API. It replaces Apify.main()
await Actor.init();

const crawler = new PlaywrightCrawler({
  // handle(Page|Request)Functions of all Crawlers
  // are now simply called a requestHandler.
  async requestHandler({ request, page, enqueueLinks }) {
    const title = await page.title();
    console.log(`Title of ${request.loadedUrl} is '${title}'`);

    // Use Actor instead of the Apify object to save data.
    await Actor.pushData({
      title,
      url: request.loadedUrl,
      content: await page.content(),
    });

    // We simplified enqueuing links a lot, see the docs.
    // This way the function adds only links to same hostname.
    await enqueueLinks();
  },
});

// You can now add requests to the queue directly from the run function.
// No need to create an instance of the queue separately.
await crawler.run(startUrls);

// This function disconnects the actor from the platform
// and optionally sends an exit message.
await Actor.exit();
