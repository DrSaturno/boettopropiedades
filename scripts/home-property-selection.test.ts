import assert from "node:assert/strict";
import test from "node:test";
import { selectHomeProperties } from "../src/lib/home-property-selection";

const listings = (count: number, featuredCount = 0) =>
  Array.from({ length: count }, (_, id) => ({ id, featured: id < featuredCount }));

test("shows every listing while eight or fewer are published", () => {
  for (const count of [0, 4, 8]) {
    const selected = selectHomeProperties(listings(count, 2));
    assert.equal(selected.length, count);
    assert.equal(new Set(selected.map((property) => property.id)).size, count);
  }
});

test("rotates only non-featured listings after eight", () => {
  const properties = listings(12, 3);
  const selected = selectHomeProperties(properties, () => 0);

  assert.equal(selected.length, 8);
  assert.deepEqual(selected.slice(0, 3).map((property) => property.id), [0, 1, 2]);
  assert.equal(new Set(selected.map((property) => property.id)).size, 8);
  assert.notDeepEqual(
    selectHomeProperties(listings(9), () => 0).map((property) => property.id),
    selectHomeProperties(listings(9), () => 0.999).map((property) => property.id)
  );
});

test("keeps every featured listing visible even when there are more than eight", () => {
  const selected = selectHomeProperties(listings(12, 9), () => 0);
  assert.deepEqual(selected.map((property) => property.id), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});
