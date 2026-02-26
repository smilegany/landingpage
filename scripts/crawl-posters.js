/**
 * 대회 홈페이지에서 포스터 이미지 URL 크롤링
 * 각 대회 사이트의 메인 이미지/포스터를 찾아 posterUrl 업데이트
 */

import { events } from '../src/data/events-data.js';

// 이미지 URL 추출 로직
async function fetchPosterUrl(homepageUrl, eventName) {
  if (!homepageUrl) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(homepageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();

    // OG 이미지 태그 찾기 (가장 신뢰할 수 있는 포스터 이미지)
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

    if (ogImageMatch) {
      let imageUrl = ogImageMatch[1];
      // 상대 경로를 절대 경로로 변환
      if (imageUrl.startsWith('/')) {
        const url = new URL(homepageUrl);
        imageUrl = `${url.protocol}//${url.host}${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        const url = new URL(homepageUrl);
        imageUrl = `${url.protocol}//${url.host}/${imageUrl}`;
      }
      return imageUrl;
    }

    // 큰 이미지 찾기 (poster, banner, main 등 키워드 포함)
    const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of imgMatches) {
      const src = match[1];
      const fullTag = match[0].toLowerCase();
      if (fullTag.includes('poster') || fullTag.includes('banner') ||
          fullTag.includes('main') || fullTag.includes('logo') ||
          src.includes('poster') || src.includes('banner')) {
        let imageUrl = src;
        if (imageUrl.startsWith('/')) {
          const url = new URL(homepageUrl);
          imageUrl = `${url.protocol}//${url.host}${imageUrl}`;
        } else if (!imageUrl.startsWith('http')) {
          const url = new URL(homepageUrl);
          imageUrl = `${url.protocol}//${url.host}/${imageUrl}`;
        }
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${eventName}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('포스터 URL 크롤링 시작...');
  console.log(`총 ${events.length}개 대회\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    process.stdout.write(`[${i + 1}/${events.length}] ${event.name.substring(0, 30)}... `);

    const posterUrl = await fetchPosterUrl(event.homepageUrl, event.name);

    if (posterUrl) {
      console.log(`✓ ${posterUrl.substring(0, 50)}...`);
      successCount++;
    } else {
      console.log('✗ 포스터 없음');
      failCount++;
    }

    results.push({
      ...event,
      posterUrl: posterUrl || event.posterUrl // 실패 시 기존 값 유지
    });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n완료! 성공: ${successCount}, 실패: ${failCount}`);

  // 결과를 새 파일로 출력
  const output = `export const events = ${JSON.stringify(results, null, 2)};

export const metadata = {
  "totalCount": ${results.length},
  "generatedAt": "${new Date().toISOString()}",
  "categories": ["cycling", "marathon", "trail"]
};
`;

  console.log('\n새 데이터:');
  console.log(output.substring(0, 2000) + '...');

  // 파일로 저장
  const fs = await import('fs');
  fs.writeFileSync('./src/data/events-data-updated.js', output);
  console.log('\n저장 완료: src/data/events-data-updated.js');
}

main();
