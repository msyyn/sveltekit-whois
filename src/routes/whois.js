import whoiser from 'whoiser';

export async function post(req) {
  if (!req.body.query) {
    return { 
      status: 400,
      body: JSON.stringify({
        error: 'Invalid or missing URL'
      })
    }
  };

  console.log('looking..')

  try {
    const domainLookup = await whoiser.domain(req.body.query, {host: 'whois.verisign-grs.com', follow: 1});
    console.log(domainLookup)

    return {
      status: 200,
      body: JSON.stringify({
        result: domainLookup
      })
    }
  } catch(error) {
    return {
      status: 400,
      body: JSON.stringify({
        error: 'No information found for domain'
      })
    }
  }
};