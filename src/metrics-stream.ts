import { runEffects, tap } from "@most/core"
import { createAdapter } from "@most/adapter"
import { newDefaultScheduler } from "@most/scheduler"

import { axiosInstance } from "./axios-instance"

interface FetchInputEvent {
  url: string
  params: { [key: string]: unknown }
  onSuccessCallback: (data: { [key: string]: unknown }) => void
}

const [induce, events] = createAdapter<FetchInputEvent>()

// todos: - group events in "packets" and send them periodically (for example once per second)
// - add a retry mechanism
const fetches = tap(
  ({ url, params, onSuccessCallback }) =>
    axiosInstance.get(url, { params }).then(({ data }) => {
      onSuccessCallback(data)
    }),
  events
)

runEffects(fetches, newDefaultScheduler())

export const fetchMetricsStream = induce
