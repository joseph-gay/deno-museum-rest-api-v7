// deno-lint-ignore-file require-await
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertInstanceOf,
} from "std/testing/asserts.ts";
import {
  Museum,
  Repository as MuseumRepository,
  Service as MuseumService,
} from "/src/museums/mod.ts";

describe("MuseumService.findAll", () => {
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
  });

  it("should return a list of museums", async () => {
    const museumService = new MuseumService({
      museumRepository: {
        findAll: async () => [{
          id: "4d74daa1-2f0f-4c53-9783-c27b82ce8b10",
          name: "Museum 1",
          description: "Description 1",
          location: {
            lat: 1,
            lng: 1,
          },
          createdAt: "2022-09-15T11:04:02.445Z",
        }],
        create: async () => {
          throw new Error("Not implemented");
        },
        getById: async () => {
          throw new Error("Not implemented");
        }
      },
    });
    const museumList = await museumService.findAll();
    const museum = museumList[0];

    assertInstanceOf(museumList, Array);
    assertEquals(museumList.length, 1);
    assertArrayIncludes(museumList, [museum]);

    assertEquals(museum.id, "4d74daa1-2f0f-4c53-9783-c27b82ce8b10");
    assertEquals(museum.name, "Museum 1");
    assertEquals(museum.description, "Description 1");
    assertEquals(museum.location.lat, 1);
    assertEquals(museum.location.lng, 1);
    assertEquals(museum.createdAt, "2022-09-15T11:04:02.445Z");
  });
});

describe("MuseumService.create", () => {
  let museumService: MuseumService;

  beforeEach(() => {
    museumService = new MuseumService({
      museumRepository: {
        findAll: async () => [],
        create: async (museum: Museum) => museum,
        getById: async () => {
          throw new Error("Not implemented");
        }
      },
    });
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
  });
});

describe("MuseumRepository.getById", () => {
  let museumService: MuseumService;

  beforeEach(() => {
    museumService = new MuseumService({
      museumRepository: {
        findAll: async () => [{
          id: "7cd858ef-3ab8-4e48-a70e-ac0ed79f731e",
          name: "Museum 1",
          description: "Description 1",
          location: {
            lat: 1,
            lng: 1,
          },
          createdAt: "2022-09-16T10:25:09.367Z",
        }],
        create: async () => {
          throw new Error("Not implemented");
        },
        getById: async (id: string) => {
          const museumList = await museumService.findAll();
          return museumList.find((m) => m.id === id) ?? null;
        }
      },
    });
  });

  it("should return a museum by id", async () => {
    const museum = await museumService.getById(
      "7cd858ef-3ab8-4e48-a70e-ac0ed79f731e",
    );

    assertEquals(museum?.id, "7cd858ef-3ab8-4e48-a70e-ac0ed79f731e");
    assertEquals(museum?.name, "Museum 1");
    assertEquals(museum?.description, "Description 1");
    assertEquals(museum?.location.lat, 1);
    assertEquals(museum?.location.lng, 1);
    assertEquals(museum?.createdAt, "2022-09-16T10:25:09.367Z");
  });
  
  it("should return null if id not found", async () => {
    const museum = await museumService.getById(
      "",
    );

    assertEquals(museum, null);
  });
});
