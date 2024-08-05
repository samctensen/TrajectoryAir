import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { ListItemButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#FFFFFF",
  marginLeft: 0,
  width: "100%",
  display: "flex",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ClearIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 31),
  height: "100%",
  position: "absolute",
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "6ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const ResultsContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1,
  marginTop: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

interface SearchBarProps {
  setLatLng(lat: number, lng: number): void;
}

export default function SearchBar({ setLatLng }: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchText],
    queryFn: async () => {
      if (!searchText) return null;
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${searchText}&country=US,UM,MX,CA&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.features;
      }
      return null;
    },
    enabled: !!searchText,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    if (searchData) {
      console.log(searchData);
    }
  }, [searchData]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search for Location..."
        inputProps={{ "aria-label": "search" }}
        value={searchText}
        onChange={handleSearchChange}
      />
      {searchText && (
        <ClearIconWrapper>
          <button onClick={() => setSearchText("")}>
            <ClearIcon color={"inherit"} />
          </button>
        </ClearIconWrapper>
      )}
      {searchData && searchData.length > 0 && (
        <ResultsContainer>
          <List>
            {searchData.map((result: any) => (
              <ListItemButton
                key={result.geometry.id}
                onClick={() => {
                  setLatLng(
                    result.properties.coordinates.latitude,
                    result.properties.coordinates.longitude
                  );
                  const params = new URLSearchParams(searchParams);
                  params.set(
                    "lat",
                    result.properties.coordinates.latitude.toString()
                  );
                  params.set(
                    "lng",
                    result.properties.coordinates.longitude.toString()
                  );
                  router.replace(`/?${params.toString()}`);
                  setSearchText("");
                }}
              >
                <ListItemText
                  primary={result.properties.name}
                  secondary={result.properties.place_formatted}
                />
              </ListItemButton>
            ))}
          </List>
        </ResultsContainer>
      )}
    </Search>
  );
}
