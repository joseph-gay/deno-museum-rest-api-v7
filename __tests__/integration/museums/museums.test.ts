import { beforeEach, describe, it } from "std/testing/bdd.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertInstanceOf,
} from "std/testing/asserts.ts";
import {
  Repository as MuseumRepository,
  Service as MuseumService,
} from "/src/museums/mod.ts";

describe("Find all museums", () => {
  let museumRepository: MuseumRepository;

  beforeEach(() => {
    museumRepository = new MuseumRepository();
  });

  it("should return an empty list upon initialization", async () => {
    const museumService = new MuseumService({ museumRepository });
    const museumList = await museumService.findAll();

    assertInstanceOf(museumList, Array);
    assertEquals(museumList.length, 0);
    assertArrayIncludes(museumList, []);
    console.log(museumList);
  });

  it("should return a list of museums", async () => {
    museumRepository.loadFixtures([
      {
        id: "1",
        name: "Museum 1",
        description: "Description 1",
        location: {
          lat: 1,
          lng: 1,
        },
        createdAt: "2022-09-15T11:42:55.936Z",
      },
    ]);
    const museumService = new MuseumService({ museumRepository });
    const museumList = await museumService.findAll();
    const museum = museumList[0];

    assertInstanceOf(museumList, Array);
    assertEquals(museumList.length, 1);
    assertArrayIncludes(museumList, [museum]);

    assertEquals(museum.id, "1");
    assertEquals(museum.name, "Museum 1");
    assertEquals(museum.description, "Description 1");
    assertEquals(museum.location.lat, 1);
    assertEquals(museum.location.lng, 1);
    assertEquals(museum.createdAt, "2022-09-15T11:42:55.936Z");
    console.log(museumList);
  });
});

describe("Create a new museum", () => {
  let museumRepository: MuseumRepository;
  let museumService: MuseumService;

  beforeEach(() => {
    museumRepository = new MuseumRepository();
    museumService = new MuseumService({ museumRepository });
  });

  it("should create a new museum", async () => {
    const newMuseum = await museumService.create({
      name: "Museum 1",
      description: "Description 1",
      location: {
        lat: 1,
        lng: 1,
      },
    });

    assertEquals(newMuseum.name, "Museum 1");
    assertEquals(newMuseum.description, "Description 1");
    assertEquals(newMuseum.location.lat, 1);
    assertEquals(newMuseum.location.lng, 1);
    console.log(newMuseum);
  });
});

describe("Get museum by id", () => {
  let museumRepository: MuseumRepository;
  let museumService: MuseumService;

  beforeEach(() => {
    museumRepository = new MuseumRepository();
    museumRepository.loadFixtures([
      {
        id: "5456d1c4-7ad0-40aa-87a9-cd23c41fc5ae",
        name: "Museum 1",
        description: "Description 1",
        location: {
          lat: 1,
          lng: 1,
        },
        createdAt: "2022-09-16T23:02:05.393Z",
      },
    ]);
    museumService = new MuseumService({ museumRepository });
  });

  it("should return a museum by id", async () => {
    const museum = await museumService.getById(
      "5456d1c4-7ad0-40aa-87a9-cd23c41fc5ae",
    );

    assertEquals(museum?.id, "5456d1c4-7ad0-40aa-87a9-cd23c41fc5ae");
    assertEquals(museum?.name, "Museum 1");
    assertEquals(museum?.description, "Description 1");
    assertEquals(museum?.location.lat, 1);
    assertEquals(museum?.location.lng, 1);
    assertEquals(museum?.createdAt, "2022-09-16T23:02:05.393Z");
    console.log(museum);
  });

  it("should return null if id not found", async () => {
    const museum = await museumService.getById("");

    assertEquals(museum, null);
    console.log(museum);
  });
});
