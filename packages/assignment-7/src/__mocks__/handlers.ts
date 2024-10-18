import { http, HttpResponse } from "msw";

import { Event } from "../types";

import { events } from "../__mocks__/response/events.json" assert { type: "json" };

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  http.post("/api/events", async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    newEvent.id = events.length + 1; // 간단한 ID 생성
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // PUT 요청 처리 (이벤트 수정)
  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedEvent = (await request.json()) as Event;
    const index = events.findIndex((event) => event.id === Number(id));

    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      return HttpResponse.json(events[index]);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE 요청 처리 (이벤트 삭제)
  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    const index = events.findIndex((event) => event.id === Number(id));

    if (index !== -1) {
      events.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
